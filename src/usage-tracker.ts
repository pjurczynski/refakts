import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface UsageEntry {
  command: string;
  timestamp: string;
  args: string[];
}

export class UsageTracker {
  private static readonly LOG_FILE = path.join(os.homedir(), '.refakts-usage.jsonl');

  static logUsage(command: string, args: string[]): void {
    const entry = this.createUsageEntry(command, args);
    this.writeLogEntry(entry);
  }

  static getUsageLog(): UsageEntry[] {
    try {
      return this.readLogFile();
    } catch {
      return [];
    }
  }

  static getUsageCounts(): Record<string, number> {
    const entries = this.getUsageLog();
    const counts: Record<string, number> = {};
    
    for (const entry of entries) {
      counts[entry.command] = (counts[entry.command] || 0) + 1;
    }
    
    return counts;
  }

  static clearUsageLog(): void {
    try {
      this.removeLogFile();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to clear usage log:', error);
    }
  }

  private static createUsageEntry(command: string, args: string[]): UsageEntry {
    return {
      command,
      timestamp: new Date().toISOString(),
      args: this.filterPrivateArgs(args)
    };
  }

  private static writeLogEntry(entry: UsageEntry): void {
    try {
      const logLine = JSON.stringify(entry) + '\n';
      fs.appendFileSync(this.LOG_FILE, logLine);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to write usage log:', error);
    }
  }

  private static readLogFile(): UsageEntry[] {
    if (!fs.existsSync(this.LOG_FILE)) {
      return [];
    }
    
    const content = fs.readFileSync(this.LOG_FILE, 'utf8');
    return this.parseLogContent(content);
  }

  private static parseLogContent(content: string): UsageEntry[] {
    const lines = this.getNonEmptyLines(content);
    const entries = this.parseLogLines(lines);
    return this.filterValidEntries(entries);
  }

  private static getNonEmptyLines(content: string): string[] {
    return content.split('\n').filter(line => line.trim());
  }

  private static parseLogLines(lines: string[]): (UsageEntry | null)[] {
    return lines.map(line => this.parseSingleLine(line));
  }

  private static parseSingleLine(line: string): UsageEntry | null {
    try {
      return JSON.parse(line);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to parse usage log line:', line, error);
      return null;
    }
  }

  private static filterValidEntries(entries: (UsageEntry | null)[]): UsageEntry[] {
    return entries.filter((entry): entry is UsageEntry => entry !== null);
  }

  private static removeLogFile(): void {
    if (fs.existsSync(this.LOG_FILE)) {
      fs.unlinkSync(this.LOG_FILE);
    }
  }

  private static filterPrivateArgs(args: string[]): string[] {
    return args.filter(arg => !arg.includes('/') && !path.isAbsolute(arg));
  }

}