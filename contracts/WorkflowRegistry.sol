// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract WorkflowRegistry {
    struct Workflow {
        bytes32 workflowId;
        address owner;
        bool active;
        uint256 createdAt;
    }

    mapping(bytes32 => Workflow) private workflows;

    event WorkflowRegistered(
        bytes32 indexed workflowId,
        address indexed owner,
        uint256 createdAt
    );

    event WorkflowStatusChanged(
        bytes32 indexed workflowId,
        bool active
    );

    function registerWorkflow(bytes32 workflowId) external {
        require(workflowId != bytes32(0), "Invalid workflow ID");
        require(workflows[workflowId].owner == address(0), "Workflow already exists");

        workflows[workflowId] = Workflow({
            workflowId: workflowId,
            owner: msg.sender,
            active: true,
            createdAt: block.timestamp
        });

        emit WorkflowRegistered(
            workflowId,
            msg.sender,
            block.timestamp
        );
    }

    function setWorkflowStatus(
        bytes32 workflowId,
        bool active
    ) external {
        Workflow storage workflow = workflows[workflowId];

        require(workflow.owner != address(0), "Workflow not found");
        require(workflow.owner == msg.sender, "Not workflow owner");

        workflow.active = active;

        emit WorkflowStatusChanged(
            workflowId,
            active
        );
    }

    function getWorkflow(
        bytes32 workflowId
    ) external view returns (Workflow memory) {
        require(
            workflows[workflowId].owner != address(0),
            "Workflow not found"
        );

        return workflows[workflowId];
    }
}
