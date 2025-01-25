import { DeepSeekIcon, MetaIcon, MicrosoftIcon } from "@/lib/icons";

export const ModelIcon = ({ name }) => {
  const lowercaseName = name.toLowerCase();

  if (lowercaseName.startsWith("deepseek"))
    return <DeepSeekIcon className="size-6" />;
  if (lowercaseName.startsWith("phi"))
    return <MicrosoftIcon className="size-6" />;
  if (lowercaseName.startsWith("llama")) return <MetaIcon className="size-6" />;
  return null;
};
