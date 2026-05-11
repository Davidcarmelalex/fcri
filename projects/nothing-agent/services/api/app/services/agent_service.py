class AgentService:
    def execute(self, intent: str):
        return {
            'status': 'accepted',
            'intent': intent,
            'execution_mode': 'approval-gated'
        }
