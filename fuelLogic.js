function calculateFuelEstimation(inputs) {
  const {
    vehicle,
    fuelPrice,
    distance,
    amountPaid,
    litresFilled,
    knownMileage
  } = inputs;

  const mileage = knownMileage && knownMileage > 0
    ? knownMileage
    : vehicle.avgMileage;

  let litresAdded = 0;
  if (litresFilled && litresFilled > 0) {
    litresAdded = litresFilled;
  } else if (amountPaid && amountPaid > 0 && fuelPrice > 0) {
    litresAdded = amountPaid / fuelPrice;
  }

  litresAdded = clamp(litresAdded, 0, vehicle.tankCapacity);

  const fuelUsed = distance / mileage;

  const remainingBeforeRefill = clamp(
    vehicle.tankCapacity - litresAdded,
    0,
    vehicle.tankCapacity
  );

  const tripFActive = remainingBeforeRefill <= vehicle.reserveLitres;

  const estimatedRange = vehicle.tankCapacity * mileage;

  const totalCost = litresFilled > 0
    ? litresFilled * fuelPrice
    : amountPaid;

  const costPerKm = totalCost / distance;

  return {
    litresAdded: clamp(litresAdded, 0, Infinity),
    fuelUsed: clamp(fuelUsed, 0, Infinity),
    remainingBeforeRefill: clamp(remainingBeforeRefill, 0, vehicle.tankCapacity),
    tripFActive,
    estimatedRange: clamp(estimatedRange, 0, Infinity),
    costPerKm: clamp(costPerKm, 0, Infinity),
    mileage: clamp(mileage, 0, Infinity),
    totalCost: clamp(totalCost, 0, Infinity)
  };
}

function createTripLog(inputs, results) {
  return {
    timestamp: nowISO(),
    vehicleId: inputs.vehicle.id,
    vehicleModel: inputs.vehicle.model,
    distance: inputs.distance,
    fuelPrice: inputs.fuelPrice,
    amountPaid: inputs.amountPaid || results.totalCost,
    litresAdded: results.litresAdded,
    fuelUsed: results.fuelUsed,
    remainingBeforeRefill: results.remainingBeforeRefill,
    tripFActive: results.tripFActive,
    estimatedRange: results.estimatedRange,
    costPerKm: results.costPerKm,
    mileage: results.mileage
  };
}
