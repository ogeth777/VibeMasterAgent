version: 1.0.0
agent:
  name: "VibeMaster"
  description: "Market Maker for Viral Trends"
  payment:
    network: "monad-testnet"
    token: "MON"

skills:
  - name: "get_active_bounties"
    description: "Returns a list of content that VibeMaster is currently paying to boost."
    inputs: []
    outputs:
      - name: "bounties"
        type: "array"
        description: "List of target URLs and payout amounts."

  - name: "submit_proof"
    description: "Submit proof of engagement (like/retweet) to claim a bounty."
    inputs:
      - name: "post_url"
        type: "string"
        description: "The URL of the content you engaged with."
      - name: "action_type"
        type: "string"
        enum: ["like", "share", "comment"]
      - name: "wallet_address"
        type: "string"
        description: "Your Monad address for payment."
    outputs:
      - name: "tx_hash"
        type: "string"
        description: "Transaction hash of your payment."
