import { ABCAnalysisDto, EOQAnalysisDto, ProfitabilityDto } from "../dtos/intelligence.dto";

export interface IIntelligenceService {
    getABCAnalysis(): Promise<ABCAnalysisDto[]>;
    getEOQAnalysis(): Promise<EOQAnalysisDto[]>;
    getProfitability(): Promise<ProfitabilityDto[]>;
}