import {
  DeepSeekIcon,
  GeminiIcon,
  IBMIcon,
  MetaIcon,
  MicrosoftIcon,
  MistralIcon,
  QwenIcon,
} from "@/lib/icons";

export const ModelIcon = ({ name }) => {
  const lowercaseName = name.toLowerCase();

  if (lowercaseName.startsWith("deepseek"))
    return <DeepSeekIcon className="size-6" />;
  if (lowercaseName.startsWith("phi"))
    return <MicrosoftIcon className="size-6" />;
  if (lowercaseName.startsWith("llama")) return <MetaIcon className="size-6" />;
  if (lowercaseName.startsWith("mistral"))
    return <MistralIcon className="size-6" />;
  if (lowercaseName.startsWith("gemma"))
    return <GeminiIcon className="size-6" />;
  if (lowercaseName.startsWith("granite"))
    return <IBMIcon className="size-6" />;
  if (lowercaseName.startsWith("qwen")) return <QwenIcon className="size-6" />;
  return <div className="size-6" />;
};
