import { spawn } from "child_process";

interface ExecOptions {
  cwd?: string;
}

const runAs = (
  command: string,
  sendMessage: (msg: string) => void,
  options: ExecOptions = {}
): Promise<void> => {
  return new Promise((resolve) => {
    const args = command.split(" ");
    const cmd = args.shift();
    if (!cmd) {
      sendMessage("❌ Invalid command.");
      return resolve();
    }

    const childProcess = spawn(cmd, args, { cwd: options.cwd });

    childProcess.stdout.on("data", (data) => {
      sendMessage(data.toString());
    });

    childProcess.stderr.on("data", (data) => {
      sendMessage(`❌ ERROR: ${data.toString()}`);
    });

    childProcess.on("close", (code) => {
      sendMessage(
        code === 0
          ? "✅ Process completed!"
          : `❌ Process failed with exit code ${code}`
      );
      resolve();
    });
  });
};

export default runAs;
