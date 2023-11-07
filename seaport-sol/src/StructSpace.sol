// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { ItemType } from "./SeaportEnums.sol";

import {SpaceEnums} from "./SpaceEnums.sol";

import {
    FulfillmentStrategy
} from "./fulfillments/lib/FulfillmentLib.sol";

struct OfferItemSpace {
    ItemType itemType;
    SpaceEnums.TokenIndex tokenIndex;
    SpaceEnums.Criteria criteria;
    SpaceEnums.Amount amount;
}

struct ConsiderationItemSpace {
    ItemType itemType;
    SpaceEnums.TokenIndex tokenIndex;
    SpaceEnums.Criteria criteria;
    SpaceEnums.Amount amount;
    SpaceEnums.Recipient recipient;
}

struct SpentItemSpace {
    ItemType itemType;
    SpaceEnums.TokenIndex tokenIndex;
}

struct ReceivedItemSpace {
    ItemType itemType;
    SpaceEnums.TokenIndex tokenIndex;
    SpaceEnums.Recipient recipient;
}

struct OrderComponentsSpace {
    SpaceEnums.Offerer offerer;
    SpaceEnums.Zone zone;
    OfferItemSpace[] offer;
    ConsiderationItemSpace[] consideration;
    SpaceEnums.BroadOrderType orderType;
    SpaceEnums.Time time;
    SpaceEnums.ZoneHash zoneHash;
    SpaceEnums.SignatureMethod signatureMethod;
    SpaceEnums.EOASignature eoaSignatureType;
    uint256 bulkSigHeight;
    uint256 bulkSigIndex;
    SpaceEnums.ConduitChoice conduit;
    SpaceEnums.Tips tips;
    SpaceEnums.UnavailableReason unavailableReason; // ignored unless unavailable
    SpaceEnums.ExtraData extraData;
    SpaceEnums.ContractOrderRebate rebate;
}

struct AdvancedOrdersSpace {
    OrderComponentsSpace[] orders;
    bool isMatchable;
    uint256 maximumFulfilled;
    SpaceEnums.FulfillmentRecipient recipient;
    SpaceEnums.ConduitChoice conduit;
    SpaceEnums.Caller caller;
    FulfillmentStrategy strategy;
}
