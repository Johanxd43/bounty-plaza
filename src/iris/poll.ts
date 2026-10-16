export async function fetchFastTransferFeeBps(
  domainPair: DomainPair,
  fetch: FetchInterface,
): Promise<number> {
  const url = buildFastFeeUrl(domainPair);
  let response: Response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw new IrisRequestError(error.status || 500, 'Failed to fetch fast transfer fees');
  }

  if (!response.ok) {
    throw new IrisRequestError(response.status, `Failed to fetch fast transfer fees: ${response.statusText}`);
  }

  const body: IrisFeeEntry[] = await response.json();
  const fastEntry = body.find((entry) => entry.finalityThreshold <= 1000);

  if (!fastEntry) {
    throw new Error(`No fast-tier entry found for domain pair: ${domainPair.source} -> ${domainPair.destination}`);
  }

  return fastEntry.minimumFee;
}