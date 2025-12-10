import os
from openai import OpenAI
 
client = OpenAI(
    api_key=os.getenv('AI_GATEWAY_API_KEY'),
    base_url='https://ai-gateway.vercel.sh/v1'
)
 
model = client.models.retrieve('anthropic/claude-sonnet-4')
print(componets/model)
