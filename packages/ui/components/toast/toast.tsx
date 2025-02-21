import { cn } from "@pollify/lib";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckIcon,
  InfoIcon,
} from "lucide-react";
import { toast as _toast, type Toast } from "react-hot-toast";

type CustomToastProps = {
  children: string;
  IconElement?: JSX.Element;
} & Omit<React.ComponentPropsWithoutRef<"button">, "children">;

const CustomToast = ({
  IconElement,
  className,
  children,
  ...props
}: CustomToastProps) => {
  return (
    <button
      className={cn(
        "flex max-w-[350px] items-center space-x-2 rounded bg-white px-4 py-3 text-neutral-900 shadow-md",
        className
      )}
      {...props}>
      {IconElement ? (
        <span className="[&_svg]:h-4 [&_svg]:w-4">{IconElement}</span>
      ) : null}
      <p className="text-sm">{children}</p>
    </button>
  );
};

type ToastOptions = Partial<Pick<Toast, "duration">>;

type CustomToastOptions = {
  variant: "blank" | "success" | "error" | "info" | "warning";
} & ToastOptions;

export const toast = (
  message: string,
  { variant, ...opts }: CustomToastOptions = { variant: "info" }
) => {
  if (variant === "info")
    return _toast.custom(
      (toast) => (
        <CustomToast
          data-testid="toast-info"
          IconElement={<InfoIcon />}
          onClick={() => _toast.remove(toast.id)}>
          {message}
        </CustomToast>
      ),
      { duration: 2000, ...opts }
    );
  if (variant === "success") {
    return _toast.custom(
      (toast) => (
        <CustomToast
          data-testid="toast-success"
          IconElement={<CheckIcon />}
          onClick={() => _toast.remove(toast.id)}>
          {message}
        </CustomToast>
      ),
      opts
    );
  }
  if (variant === "warning") {
    return _toast.custom(
      (toast) => (
        <CustomToast
          data-testid="toast-warning"
          IconElement={<AlertTriangleIcon />}
          onClick={() => _toast.remove(toast.id)}>
          {message}
        </CustomToast>
      ),
      opts
    );
  }
  if (variant === "error") {
    return _toast.custom(
      (toast) => (
        <CustomToast
          data-testid="toast-error"
          IconElement={<AlertCircleIcon />}
          onClick={() => _toast.remove(toast.id)}>
          {message}
        </CustomToast>
      ),
      opts
    );
  }
  return _toast.custom(
    (toast) => (
      <CustomToast
        data-testid="toast-blank"
        onClick={() => _toast.remove(toast.id)}>
        {message}
      </CustomToast>
    ),
    opts
  );
};
