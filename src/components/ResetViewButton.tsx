type ResetViewButtonProps = {
  onReset: () => void;
};

function ResetViewButton({ onReset }: ResetViewButtonProps) {
  return (
    <button className="reset-button" type="button" onClick={onReset} aria-label="重設臺灣全圖視角">
      <span aria-hidden="true">⌂</span>
      重設視角
    </button>
  );
}

export default ResetViewButton;
