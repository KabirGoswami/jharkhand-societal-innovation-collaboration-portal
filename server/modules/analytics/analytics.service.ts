import { INITIAL_ANALYTICS } from '../../../src/data/jharkhandData';
import { AnalyticsSummary } from '../../../src/types';
import { problemsService } from '../problems/problems.service';

let analytics = { ...INITIAL_ANALYTICS };

export class AnalyticsService {
  async getAnalyticsSummary() {
    // Recalculate some numbers based on current problems
    const problems = await problemsService.getAllProblems({});

    const totalChallengesReceived = problems.length + 241; // keeping a base offset for demo
    const activePrototypes = problems.filter((p: any) => p.status === 'prototyping' || p.status === 'field_testing').length + 65;
    const fieldPilotsDeployed = problems.filter((p: any) => p.status === 'deployed').length + 34;

    return {
      ...analytics,
      totalChallengesReceived,
      activePrototypes,
      fieldPilotsDeployed,
    };
  }
}

export const analyticsService = new AnalyticsService();
