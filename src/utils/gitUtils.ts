import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const autoCommitAndPush = async (message: string) => {
  try {
    // Add all changes
    await execAsync('git add .');
    
    // Commit changes
    await execAsync(`git commit -m "${message}"`);
    
    // Push to remote repository
    await execAsync('git push origin main');
    
    console.log('✅ Successfully committed and pushed changes');
  } catch (error) {
    console.error('❌ Error in git operations:', error);
    throw error;
  }
}; 