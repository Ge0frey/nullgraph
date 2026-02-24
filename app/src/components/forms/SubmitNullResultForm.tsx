import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { ProgressBar } from "../ui/ProgressBar";
import { StepHypothesis } from "./StepHypothesis";
import { StepResults } from "./StepResults";
import { StepData } from "./StepData";
import { StepReview } from "./StepReview";
import { useSubmitNullResult } from "../../hooks/useSubmitNullResult";
import { encodeString, hashFile, hexToBytes } from "../../lib/utils";

const TOTAL_STEPS = 4;

export function SubmitNullResultForm() {
  const navigate = useNavigate();
  const { submit, loading } = useSubmitNullResult();
  const [step, setStep] = useState(1);

  const [hypothesis, setHypothesis] = useState("");
  const [methodology, setMethodology] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [actualOutcome, setActualOutcome] = useState("");
  const [pValue, setPValue] = useState("");
  const [sampleSize, setSampleSize] = useState("");
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [dataHash, setDataHash] = useState("");

  const onChange = useCallback((field: string, value: string) => {
    switch (field) {
      case "hypothesis": setHypothesis(value); break;
      case "methodology": setMethodology(value); break;
      case "expectedOutcome": setExpectedOutcome(value); break;
      case "actualOutcome": setActualOutcome(value); break;
      case "pValue": setPValue(value); break;
      case "sampleSize": setSampleSize(value); break;
    }
  }, []);

  const handleFileChange = useCallback(async (file: File | null) => {
    setDataFile(file);
    if (file) {
      const hash = await hashFile(file);
      setDataHash(hash);
    } else {
      setDataHash("");
    }
  }, []);

  const canAdvance = () => {
    switch (step) {
      case 1: return hypothesis.trim().length > 0 && methodology.trim().length > 0;
      case 2: return expectedOutcome.trim().length > 0 && actualOutcome.trim().length > 0;
      case 3: return true; // Data is optional
      case 4: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    const pValueFixed = pValue ? Math.round(parseFloat(pValue) * 10000) : 0;
    const sampleSizeNum = sampleSize ? parseInt(sampleSize, 10) : 0;
    const hashBytes = dataHash
      ? hexToBytes(dataHash)
      : Array(32).fill(0);

    const specimenNumber = await submit({
      hypothesis: encodeString(hypothesis, 128),
      methodology: encodeString(methodology, 128),
      expectedOutcome: encodeString(expectedOutcome, 128),
      actualOutcome: encodeString(actualOutcome, 128),
      pValue: pValueFixed,
      sampleSize: sampleSizeNum,
      dataHash: hashBytes,
    });

    if (specimenNumber) {
      navigate(`/nka/${specimenNumber}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <ProgressBar current={step} total={TOTAL_STEPS} />
        <div className="flex items-center gap-3 mt-3">
          {[1, 2, 3, 4].map((s) => (
            <span
              key={s}
              className={`text-[10px] font-mono font-bold tracking-widest ${
                s === step ? "text-neon-cyan" : s < step ? "text-neon-lime" : "text-text-tertiary"
              }`}
            >
              0{s}
            </span>
          ))}
          <span className="text-[10px] font-mono font-bold text-text-tertiary tracking-widest ml-auto">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        {step === 1 && (
          <StepHypothesis
            hypothesis={hypothesis}
            methodology={methodology}
            onChange={onChange}
          />
        )}
        {step === 2 && (
          <StepResults
            expectedOutcome={expectedOutcome}
            actualOutcome={actualOutcome}
            pValue={pValue}
            sampleSize={sampleSize}
            onChange={onChange}
          />
        )}
        {step === 3 && (
          <StepData
            dataFile={dataFile}
            dataHash={dataHash}
            onFileChange={handleFileChange}
          />
        )}
        {step === 4 && (
          <StepReview
            hypothesis={hypothesis}
            methodology={methodology}
            expectedOutcome={expectedOutcome}
            actualOutcome={actualOutcome}
            pValue={pValue}
            sampleSize={sampleSize}
            dataHash={dataHash}
          />
        )}

        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <div />
          )}
          {step < TOTAL_STEPS ? (
            <Button
              variant="amber"
              onClick={() => setStep(step + 1)}
              disabled={!canAdvance()}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={loading}
            >
              Submit to Chain
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
