import { useState } from "react";
import { Textarea } from "../ui/Textarea";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useCreateBounty } from "../../hooks/useCreateBounty";
import { encodeString } from "../../lib/utils";

interface CreateBountyFormProps {
  onSuccess: () => void;
}

export function CreateBountyForm({ onSuccess }: CreateBountyFormProps) {
  const { create, loading } = useCreateBounty();
  const [description, setDescription] = useState("");
  const [rewardUsdc, setRewardUsdc] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("7");

  const handleSubmit = async () => {
    const rewardAmount = Math.round(parseFloat(rewardUsdc) * 1_000_000);
    const deadline = Math.floor(Date.now() / 1000) + parseInt(deadlineDays, 10) * 86400;

    const result = await create({
      description: encodeString(description, 256),
      rewardAmount,
      deadline,
    });

    if (result) {
      onSuccess();
    }
  };

  const valid = description.trim().length > 0 && parseFloat(rewardUsdc) > 0;

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        label="What null result do you need?"
        placeholder="e.g., Looking for evidence that CRISPR efficiency does NOT improve in plant cells under UV exposure..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        maxLength={256}
      />
      <p className="text-[10px] font-mono text-text-tertiary text-right -mt-2">
        {description.length}/256
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Reward (USDC)"
          type="number"
          placeholder="e.g., 10.00"
          value={rewardUsdc}
          onChange={(e) => setRewardUsdc(e.target.value)}
          min="0.01"
          step="0.01"
        />
        <Input
          label="Deadline (days)"
          type="number"
          placeholder="e.g., 7"
          value={deadlineDays}
          onChange={(e) => setDeadlineDays(e.target.value)}
          min="1"
        />
      </div>

      <Button
        variant="primary"
        onClick={handleSubmit}
        loading={loading}
        disabled={!valid || loading}
        className="w-full mt-2"
      >
        Deposit USDC & Create Bounty
      </Button>
    </div>
  );
}
