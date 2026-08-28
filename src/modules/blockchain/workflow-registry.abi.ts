export const workflowRegistryAbi = [
  {
    type: "function",
    name: "registerWorkflow",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "workflowId",
        type: "bytes32"
      }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "setWorkflowStatus",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "workflowId",
        type: "bytes32"
      },
      {
        name: "active",
        type: "bool"
      }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "getWorkflow",
    stateMutability: "view",
    inputs: [
      {
        name: "workflowId",
        type: "bytes32"
      }
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          {
            name: "workflowId",
            type: "bytes32"
          },
          {
            name: "owner",
            type: "address"
          },
          {
            name: "active",
            type: "bool"
          },
          {
            name: "createdAt",
            type: "uint256"
          }
        ]
      }
    ]
  }
] as const;
