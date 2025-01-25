import { memo } from "react";
import { formatModelName, formatSize } from "@/lib/formatting";
import { ModelIcon } from "@/components/ModelIcon";

export const ModelListItem = memo(({ item }) => (
  <div className="flex items-center gap-3">
    <ModelIcon name={item.name} />
    <div>
      <div className="flex items-center gap-1.5">
        <span className="text-base font-semibold">
          {formatModelName(item.name).baseName}
        </span>
        <span className="text-sm text-blue-500 font-semibold px-1 py-0.5 rounded-sm bg-blue-100">
          {item.details.parameter_size}
        </span>
      </div>
      <span className="mt-1.5 text-sm text-gray-600 font-mono">
        {item.details.family}|{formatSize(item.size)}|
        {item.details.quantization_level}
      </span>
    </div>
  </div>
));
