# Workflow Architecture

## Overview

This document describes the workflow architecture for the garment production tracking system, focusing on the operator mobile experience, offline synchronization, and backend transaction guarantees.

The architecture is designed to support:
- offline-first scanning
- automatic background sync
- atomic MongoDB transactions
- valid stage transitions only
- no negative stock updates
- complete audit history

## Mobile Operator Flow

1. Operator logs in on the mobile application.
2. If online, the app downloads master data into local SQLite caches.
3. Operator scans a bundle or enters it manually.
4. The app validates the bundle against the cached data.
5. If valid, the operation is saved in the `PendingQueue`.
6. The operator continues working immediately without waiting for network connectivity.

## SQLite Offline Structure

The mobile app stores local data in SQLite with the following key tables:

- `BundlesCache`
  - bundleId
  - bundleCode
  - currentStage
  - quantity
  - lastUpdated

- `StylesCache`
  - styleId
  - sku
  - styleName
  - description
  - lastUpdated

- `PendingQueue`
  - id
  - bundleId
  - fromStage
  - toStage
  - operatorId
  - status
  - retryCount
  - createdAt

- `SyncMetadata`
  - lastSyncAt
  - syncInProgress
  - lastError

## Data Model & Table Design

The architecture uses both SQLite and MongoDB. The table and collection design is intentionally simple and aligned with the offline-first workflow.

### SQLite Table Design

| Table | Key Columns | Purpose |
|---|---|---|
| `BundlesCache` | `bundleId`, `bundleCode`, `currentStage`, `quantity`, `lastUpdated` | Stores offline-ready bundle state for validation and quick lookup |
| `StylesCache` | `styleId`, `sku`, `styleName`, `description`, `lastUpdated` | Stores style metadata required for offline validation and display |
| `PendingQueue` | `id`, `bundleId`, `fromStage`, `toStage`, `operatorId`, `status`, `retryCount`, `createdAt` | Queues offline operations for later synchronization |
| `SyncMetadata` | `lastSyncAt`, `syncInProgress`, `lastError` | Tracks synchronization status and recovery information |

### MongoDB Collection Design

| Collection | Key Fields | Purpose |
|---|---|---|
| `Users` | `name`, `email`, `password`, `role` | Stores authentication and role-based access data |
| `Styles` | `sku`, `styleName`, `description` | Stores master style definitions |
| `Bundles` | `bundleCode`, `style`, `quantity`, `currentStage` | Stores active bundles and their current production stage |
| `StageHistories` | `bundle`, `operator`, `fromStage`, `toStage`, `createdAt` | Stores immutable audit records for each bundle movement |
| `Stocks` | `bundle`, `quantity`, `location` | Stores finished stock levels and location information |

## Offline Scan Flow

When a bundle is scanned offline:

1. The app searches for the bundle in `BundlesCache`.
2. If not found, the user is prompted to reconnect and refresh.
3. If found, the app validates the current stage and transition.
4. The operation is inserted into `PendingQueue`.
5. If the same bundle transition is already pending, the scan is rejected to prevent duplicates.

## Background Synchronization

When internet returns:

1. The sync service reads the oldest pending record.
2. It sends the operation to the backend via a `/sync` endpoint.
3. The backend validates the bundle, stage, and stock.
4. If successful, the pending record is removed or marked completed.
5. If it fails, the retry count increases.
6. If the retry limit is reached, the record is marked as failed but retained.

## Backend Transaction Flow

Each synchronization request is processed inside a MongoDB transaction:

1. Validate the current bundle state.
2. Validate the requested stage transition.
3. Update the bundle document.
4. Insert a stage history record.
5. Update finished stock if required.
6. Commit the transaction.

If any step fails, the transaction is rolled back and no partial changes are persisted.

## Stage Transition Validation

Valid production stages are strictly enforced in sequence:

- Cutting
- Stitching
- Finishing
- Packing
- Factory Store
- Dispatch

Invalid transitions are rejected with conflict responses.

## Duplicate and Conflict Handling

To avoid conflicting updates:

- the mobile app prevents duplicate pending transitions for the same bundle
- the backend verifies the bundle's current stage inside the transaction
- concurrent updates on the same bundle are resolved by transaction semantics
- only the first valid stage update succeeds, subsequent conflicting requests are rejected

## Stock Safety Rules

The backend enforces stock consistency:

- finished stock cannot become negative
- stock movements are validated before update
- insufficient stock causes the transaction to abort

## Architecture Summary

Operator Mobile App
  → SQLite Offline Cache
  → Background Sync Service
  → Node.js + Express API
  → MongoDB Atlas
  → Manager Dashboard

## Goal

The architecture ensures that operators can keep scanning bundles without network dependency, while managers receive an accurate and consistent production picture. It emphasizes resilience, data integrity, and clear workflow enforcement throughout the system.
