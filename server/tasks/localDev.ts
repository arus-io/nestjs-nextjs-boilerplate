import { AppLogger } from '../modules/infra/logger/app.logger';
import { DataFixture } from '../test-utils/dataFixture';
import { AppTask } from './_task';

export default class SeedTasks extends AppTask {
  public async doWork(args?: string[]): Promise<any> {
    const logger = await this.app.resolve(AppLogger);

    logger.log('--------------- Regenerating local database -----------------------------');
    const f = new DataFixture(this.app);
    await f.clearDatabase();
    logger.log('--------------- Loading a sample dataset --------------------------------');
    await f.localDevDataset();
    logger.log('------ 💻🐒💻🐒💻🐒 Finish! Now code! 💻🐒💻🐒💻🐒 ---------');
  }
}
