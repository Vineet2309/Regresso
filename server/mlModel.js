const { spawn } = require('child_process');
const path = require('path');

console.log('Starting test...');
let success=1;
const pythonProcess = spawn('py', ['-u', 'regresso_model.py'], {
  cwd: path.join(__dirname, '../mlModel')
});

let stdoutLogs = '';
let stderrLogs = '';

pythonProcess.stdout.on('data', (data) => {
  const chunk = data.toString();
  console.log(`stdout: ${chunk}`);
  stdoutLogs += chunk;
});

pythonProcess.stderr.on('data', (data) => {
  const chunk = data.toString();
  console.error(`stderr: ${chunk}`);
  stderrLogs += chunk;
});

pythonProcess.on('error', (err) => {
  console.error(`Failed to start subprocess: ${err}`);
});

pythonProcess.on('close', (code) => {
  success=code;
  console.log(`Process exited with code: ${code}`);
  console.log(`Collected stdout: ${stdoutLogs}`);
  console.log(`Collected stderr: ${stderrLogs}`);
});