export async function timedOperation(label, operation, metadata = {}) {
  const startedAt = performance.now();

  try {
    const result = await operation();
    const durationMs = Number((performance.now() - startedAt).toFixed(2));

    console.log(`[timing] ${label}`, {
      durationMs,
      ...metadata,
    });

    return result;
  } catch (error) {
    const durationMs = Number((performance.now() - startedAt).toFixed(2));

    console.error(`[timing] ${label} failed`, {
      durationMs,
      ...metadata,
    });

    throw error;
  }
}
