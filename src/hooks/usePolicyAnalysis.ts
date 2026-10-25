import { useState, useMemo, useCallback } from 'react';
import { PolicyAnalysisResult, DataTypeTrail } from '../types/policy';
import { PolicyAnalyzerEngine } from '../engine/analyzer';
import { SAMPLE_POLICIES } from '../data/samples';

export function usePolicyAnalysis(initialText?: string, initialTitle?: string) {
  const [text, setText] = useState<string>(initialText || SAMPLE_POLICIES[0].text);
  const [title, setTitle] = useState<string>(initialTitle || SAMPLE_POLICIES[0].name);
  const [selectedTypeId, setSelectedTypeId] = useState<string>('location');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Deterministically compute analysis result
  const analysisResult: PolicyAnalysisResult = useMemo(() => {
    return PolicyAnalyzerEngine.analyze(text, title);
  }, [text, title]);

  // Keep selected data type valid
  const activeTrail: DataTypeTrail = useMemo(() => {
    const found = analysisResult.discoveredDataTypes.find(t => t.id === selectedTypeId);
    return found || analysisResult.discoveredDataTypes[0];
  }, [analysisResult, selectedTypeId]);

  const setPolicy = useCallback((newText: string, newTitle: string) => {
    setIsAnalyzing(true);
    setText(newText);
    setTitle(newTitle);

    // Let state settle
    setTimeout(() => {
      // Pick first discovered data type for new policy if current is missing
      const newResult = PolicyAnalyzerEngine.analyze(newText, newTitle);
      if (newResult.discoveredDataTypes.length > 0) {
        setSelectedTypeId(newResult.discoveredDataTypes[0].id);
      }
      setIsAnalyzing(false);
    }, 150);
  }, []);

  return {
    text,
    title,
    analysisResult,
    selectedTypeId,
    setSelectedTypeId,
    activeTrail,
    isAnalyzing,
    setPolicy
  };
}
