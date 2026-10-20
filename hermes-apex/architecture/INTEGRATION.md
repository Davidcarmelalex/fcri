# FCRI monorepo integration

The existing Next.js institutional website remains untouched. Hermes APEX lives in hermes-apex/ and is separately testable. Integration with FCRI research, FAASI evaluation, AZRAEL, NRLink, and MrNothing must be implemented through explicitly authorized adapters, never by directly sharing production credentials. The parent repo currently uses Next.js 16 and TypeScript; the agent prototype uses Python 3.11+. Do not claim the design roles are active workers.
