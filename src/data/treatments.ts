import { gastrointestinalData } from './services/gastrointestinal';
import { skinDisordersData } from './services/skin-disorders';
import { neuroMuscularData } from './services/neuro-muscular';
import { femaleDiseaseData } from './services/female-disease';
import { maleDiseaseData } from './services/male-disease';
import { panchkarmaData } from './services/panchkarma';
import { respiratoryCareData } from './services/respiratory-care';
import { weightManagementData } from './services/weight-management';
import { diabetesCareData } from './services/diabetes-care';
import { stressAnxietyData } from './services/stress-anxiety';
import { hairScalpCareData } from './services/hair-scalp-care';
import { eyeCareData } from './services/eye-care';
import { pediatricCareData } from './services/pediatric-care';
import { postPregnancyCareData } from './services/post-pregnancy-care';
import { addictionRecoveryData } from './services/addiction-recovery';
import { cardiovascularHealthData } from './services/cardiovascular-health';
import { generalConsultationData } from './services/general-consultation';
import { yogaMeditationData } from './services/yoga-meditation';
import { geriatricCareData } from './services/geriatric-care';
import { urinaryDisordersData } from './services/urinary-disorders';

export interface TreatmentContent {
  whatIsIt: string;
  howItHappens: string;
  whatToDo: string;
  benefits: string;
  localSEO: string;
  lifestyle: string;
  diet: string;
  homeRemedies: string;
  faq: Array<{ q: string; a: string }>;
}

export interface Treatment {
  slug: string;
  title: string;
  fullTitle: string;
  description: string;
  content: TreatmentContent;
  keywords: string[];
}

export const getTreatments = (t: any): Treatment[] => {
  return [
    gastrointestinalData(t),
    skinDisordersData(t),
    neuroMuscularData(t),
    femaleDiseaseData(t),
    maleDiseaseData(t),
    panchkarmaData(t),
    respiratoryCareData(t),
    weightManagementData(t),
    diabetesCareData(t),
    stressAnxietyData(t),
    hairScalpCareData(t),
    eyeCareData(t),
    pediatricCareData(t),
    postPregnancyCareData(t),
    addictionRecoveryData(t),
    cardiovascularHealthData(t),
    generalConsultationData(t),
    yogaMeditationData(t),
    geriatricCareData(t),
    urinaryDisordersData(t)
  ];
};
