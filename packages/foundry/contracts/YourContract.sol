//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";
import {StructuredLinkedList} from
    "solidity-linked-list/contracts/StructuredLinkedList.sol";

// import "@openzeppelin/contracts/access/Ownable.sol";

contract YourContract {
    using StructuredLinkedList for StructuredLinkedList.List;

    struct BaseStructure {
        address contact;
        string displayName;
    }

    // struct MasterStructure {
    //     StructuredLinkedList.List s_list;
    //     mapping(uint256 => BaseStructure) s_structureMap;
    //     uint256 s_progressiveId;
    // }

    // mapping(address user => MasterStructure sheet) userBook;

    mapping(address user => StructuredLinkedList.List list) public s_list;
    mapping(address user => mapping(uint256 => BaseStructure)) public
        s_structureMap;
    mapping(address user => uint256) public s_progressiveId;

    // StructuredLinkedList.List public s_list;
    // mapping(uint256 => BaseStructure) public s_structureMap;
    // uint256 s_progressiveId;

    function add(address contact, string memory displayName) public {
        s_progressiveId[msg.sender] = s_progressiveId[msg.sender] + 1;
        s_structureMap[msg.sender][s_progressiveId[msg.sender]] =
            BaseStructure(contact, displayName);
        s_list[msg.sender].pushBack(s_progressiveId[msg.sender]);
    }

    function getSizeOf(address user) external view returns (uint256 sizeOf) {
        sizeOf = s_list[user].sizeOf();
    }

    function remove(address contact) public {
        uint256 sizeOf = s_list[msg.sender].sizeOf();

        uint256 selectedNode = 0;

        for (uint256 i = 1; i <= sizeOf; i++) {
            (bool exists, uint256 next) =
                s_list[msg.sender].getNextNode(selectedNode);
            selectedNode = next;

            if (exists) {
                if (s_structureMap[msg.sender][selectedNode].contact == contact)
                {
                    s_list[msg.sender].remove(selectedNode);
                }
            }
        }
    }

    function removeByIndex(uint256 index) external {
        uint256 sizeOf = s_list[msg.sender].sizeOf();

        uint256 selectedNode = 0;

        for (uint256 i = 1; i <= sizeOf; i++) {
            (bool EXISTS, uint256 NEXT) =
                s_list[msg.sender].getNextNode(selectedNode);
            selectedNode = NEXT;

            if (EXISTS) {
                if (i == index) {
                    s_list[msg.sender].remove(selectedNode);
                }
            }
        }
    }

    // function add(address contact, string memory displayName) public {
    //     userBook[msg.sender].s_progressiveId =
    //         userBook[msg.sender].s_progressiveId + 1;
    //     userBook[msg.sender].s_structureMap[userBook[msg.sender].s_progressiveId]
    //     = BaseStructure(contact, displayName);

    //     userBook[msg.sender].s_list.pushBack(
    //         userBook[msg.sender].s_progressiveId
    //     );
    // }

    // function getAddressBook(address user) external view returns(MasterStructure memory) {
    //     return userBook[user];
    // }

    // function getSizeOf() external view returns (uint256 sizeOf) {
    //     sizeOf = userBook[msg.sender].s_list.sizeOf();
    // }

    // function remove(address contact) public {
    //     uint256 sizeOf = userBook[msg.sender].s_list.sizeOf();

    //     uint256 selectedNode = 0;

    //     for (uint256 i = 1; i <= sizeOf; i++) {
    //         (bool exists, uint256 next) =
    //             userBook[msg.sender].s_list.getNextNode(selectedNode);
    //         selectedNode = next;

    //         if (exists) {
    //             if (
    //                 userBook[msg.sender].s_structureMap[selectedNode].contact
    //                     == contact
    //             ) {
    //                 userBook[msg.sender].s_list.remove(selectedNode);
    //             }
    //         }
    //     }
    // }

    struct BaseStructureWithNodeIndex {
        BaseStructure baseStructure;
        uint256 nodeIndex;
    }

    function getAll(address user)
        external
        view
        returns (BaseStructureWithNodeIndex[] memory)
    {
        uint256 sizeOf = s_list[user].sizeOf();

        BaseStructureWithNodeIndex[] memory entries =
            new BaseStructureWithNodeIndex[](sizeOf);
        // BaseStructure[] memory entries = new BaseStructure[](sizeOf);
        // uint256[] memory entriesIds = new uint256[](sizeOf);

        uint256 selectedNode = 0;

        for (uint256 i = 1; i <= sizeOf; i++) {
            (bool exists, uint256 next) = s_list[user].getNextNode(selectedNode);
            selectedNode = next;

            if (exists) {
                entries[i - 1].baseStructure =
                    s_structureMap[user][selectedNode];
                entries[i - 1].nodeIndex = selectedNode;
            }
        }

        return entries;
    }
}
