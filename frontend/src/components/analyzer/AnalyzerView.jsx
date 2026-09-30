import React, { useState } from 'react';
import InputSection from './InputSection';
import PipelineVisualizer from './PipelineVisualizer';
import StageDetailsModal from './StageDetailsModal';
import ScoreExplanationModal from './ScoreExplanationModal';
import BattleView from './BattleView';
import TechnicalReport from './TechnicalReport';
import { analyzeResume, analyzeResumeFile } from '../../utils/api';
import confetti from 'canvas-confetti';

export default function AnalyzerView({
  resumeText,
  setResumeText,
  jobText,
  setJobText,
  analysisData,
  setAnalysisData,
  isAnalyzing,
  setIsAnalyzing
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeStageIndex, setActiveStageIndex] = useState(6);
  const [inspectingStage, setInspectingStage] = useState(null);
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const executeLivePipeline = async () => {
    setErrorMessage('');
    setIsAnalyzing(true);
    setActiveStageIndex(0);

    try {
      let result;
      if (selectedFile) {
        result = await analyzeResumeFile(selectedFile, jobText);
      } else {
        result = await analyzeResume(resumeText, jobText);
      }

      // Simulate sequential animated stage progression
      for (let i = 0; i < 7; i++) {
        setActiveStageIndex(i);
        await new Promise((resolve) => setTimeout(resolve, 350));
      }

      setAnalysisData(result);
      if (result.overall_score >= 65) {
        triggerConfetti();
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReplayAnimation = async () => {
    if (!analysisData) return;
    setActiveStageIndex(0);
    for (let i = 0; i < 7; i++) {
      setActiveStageIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Input section: candidate resume & job description */}
      <InputSection
        resumeText={resumeText}
        setResumeText={setResumeText}
        jobText={jobText}
        setJobText={setJobText}
        onAnalyze={executeLivePipeline}
        onFileSelect={handleFileSelect}
        selectedFileName={selectedFile ? selectedFile.name : ''}
        isAnalyzing={isAnalyzing}
      />

      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Section 13: Animated Live Pipeline */}
      {analysisData && (
        <>
          <PipelineVisualizer
            stages={analysisData.stages}
            activeStageIndex={activeStageIndex}
            onSelectStage={(stage) => setInspectingStage(stage)}
            onOpenExplanation={() => setShowExplanationModal(true)}
            overallScore={analysisData.overall_score}
            matchedWeight={analysisData.matched_weight}
            totalWeight={analysisData.total_weight}
            formulaString={analysisData.formula_string}
            isAnalyzing={isAnalyzing}
            onReplayAnimation={handleReplayAnimation}
          />

          {/* Section 15: Battle View */}
          <BattleView battleItems={analysisData.battle_view} />

          {/* Section 18: Technical Report */}
          <TechnicalReport reportData={analysisData.technical_report} />
        </>
      )}

      {/* Stage Deep Dive Inspector Modal */}
      {inspectingStage && (
        <StageDetailsModal
          stage={inspectingStage}
          onClose={() => setInspectingStage(null)}
        />
      )}

      {/* Section 14: "How Was This Score Calculated?" Modal */}
      {showExplanationModal && analysisData && (
        <ScoreExplanationModal
          requirements={analysisData.requirements_explanation}
          initialOverallScore={analysisData.overall_score}
          initialMatchedWeight={analysisData.matched_weight}
          initialTotalWeight={analysisData.total_weight}
          initialFormulaString={analysisData.formula_string}
          onClose={() => setShowExplanationModal(false)}
        />
      )}
    </div>
  );
}
