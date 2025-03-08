const allowedUnits = ["y", "m", "d", "h"] as const;
type Unit = (typeof allowedUnits)[number];

export const parseInterval = (interval: string): [number, Unit] => {
  const value = parseInt(interval.match(/\d+/)![0]);
  if (value <= 0) throw new Error("Invalid interval value.");
  const unit = interval.slice(-1) as Unit;
  if (!allowedUnits.includes(unit)) {
    throw new Error("Invalid interval unit type.");
  }
  return [value, unit];
};
