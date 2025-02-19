const allowedUnits = ["y", "m", "d", "h"] as const;
type Unit = (typeof allowedUnits)[number];

export const parseInterval = (interval: string): [number, Unit] => {
  const value = Number.parseInt(interval);
  if (value <= 0) throw new Error("Invalid interval value.");
  const unit = interval.slice(`${value}`.length) as Unit;
  if (!allowedUnits.includes(unit)) {
    throw new Error("Invalid interval unit type.");
  }
  return [value, unit];
};
