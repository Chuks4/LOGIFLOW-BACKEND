# 🚚 LogiFlow

> A production-ready Logistics Management System built with Node.js, Express, PostgreSQL, and Sequelize.

LogiFlow is a backend-focused logistics management platform that enables customers to create shipments, dispatchers to assign deliveries, drivers to complete deliveries, and administrators to manage the entire logistics operation.

The project is designed to demonstrate intermediate backend engineering skills, including authentication, role-based access control, payment integration, background jobs, caching, WebSockets, testing, Docker, and scalable architecture.

---

# Table of Contents

- Overview
- Features
- User Roles
- System Workflow
- Technology Stack
- System Architecture
- Database Design
- API Modules
- Project Roadmap
- Future Improvements
- Getting Started
- Folder Structure
- Testing
- Deployment
- License

---

# Overview

LogiFlow simulates a real-world logistics company where customers can create shipments and track deliveries while dispatchers assign drivers and monitor delivery progress.

The system focuses on:

- Secure authentication
- Shipment lifecycle management
- Driver assignment
- Real-time shipment tracking
- Payment processing
- Delivery confirmation
- Notifications
- Analytics

---

# Features

## Authentication

- [ ] Register
- [ ] Login
- [ ] Refresh Tokens
- [ ] Email Verification
- [ ] Forgot Password
- [ ] Password Reset
- [ ] Change Password
- [ ] JWT Authentication

---

## User Management

- [ ] Customer
- [ ] Driver
- [ ] Dispatcher
- [ ] Warehouse Staff
- [ ] Administrator

---

## Shipment Management

- [ ] Create Shipment
- [ ] Edit Shipment
- [ ] Cancel Shipment
- [ ] Shipment Pricing
- [ ] Shipment Tracking Number
- [ ] Shipment History
- [ ] Shipment Status Updates

---

## Driver Management

- [ ] Driver Registration
- [ ] Vehicle Assignment
- [ ] Accept Delivery
- [ ] Reject Delivery
- [ ] Delivery History
- [ ] Driver Availability

---

## Dispatcher

- [ ] Assign Driver
- [ ] Reassign Driver
- [ ] View Active Deliveries
- [ ] Monitor Drivers
- [ ] Delivery Dashboard

---

## Delivery Tracking

- [ ] Live Location Updates
- [ ] Estimated Arrival Time
- [ ] Delivery Timeline
- [ ] Tracking History

---

## Payments

- [ ] Paystack Integration
- [ ] Payment Verification
- [ ] Payment Webhooks
- [ ] Refund Support

---

## Notifications

- [ ] Email Notifications
- [ ] SMS Notifications
- [ ] Push Notifications
- [ ] In-App Notifications

---

## Reports

- [ ] Daily Deliveries
- [ ] Revenue Report
- [ ] Driver Performance
- [ ] Failed Deliveries
- [ ] Customer Analytics

---

# User Roles

## Customer

Responsibilities

- Create shipments
- Pay for deliveries
- Track deliveries
- Receive notifications
- Rate drivers

---

## Driver

Responsibilities

- Accept assigned jobs
- Pick up packages
- Update shipment status
- Share location
- Upload proof of delivery

---

## Dispatcher

Responsibilities

- View pending shipments
- Assign drivers
- Monitor deliveries
- Handle failed deliveries

---

## Warehouse Staff

Responsibilities

- Receive shipments
- Sort packages
- Dispatch packages
- Update inventory

---

## Administrator

Responsibilities

- Manage users
- Manage pricing
- View analytics
- Manage warehouses
- Configure system

---

# Shipment Lifecycle

Draft

↓

Pending Payment

↓

Paid

↓

Pending Assignment

↓

Assigned

↓

Accepted

↓

Driver En Route

↓

Picked Up

↓

In Transit

↓

Out For Delivery

↓

Delivered

↓

Completed

Alternative States

- Cancelled
- Failed Delivery
- Returned
- Lost
- Damaged

---

# System Workflow

Customer

↓

Create Shipment

↓

Price Calculation

↓

Payment

↓

Dispatcher Assignment

↓

Driver Accepts

↓

Package Pickup

↓

Transit

↓

Delivery

↓

Proof of Delivery

↓

Customer Confirmation

↓

Completed

---

# Technology Stack

## Backend

- Node.js
- Express.js

## Database

- PostgreSQL
- Sequelize ORM

## Authentication

- JWT
- bcrypt

## Validation

- Zod

## Documentation

- Swagger

## Storage

- Cloudinary

## Queue

- BullMQ

## Cache

- Redis

## Real-Time

- Socket.io

## Testing

- Jest
- Supertest

## DevOps

- Docker
- Docker Compose

---

# System Architecture

```
Client

↓

REST API

↓

Controllers

↓

Services

↓

Repositories

↓

Database

↓

PostgreSQL
```

Supporting Services

- Redis
- BullMQ
- Cloudinary
- Socket.io
- Paystack

---

# Folder Structure

```

├── config
├── controllers
├── middleware
├── models
├── repositories
├── services
├── validators
├── routes
├── jobs
├── sockets
├── events
├── utils
├── docs
├── tests
└── app.js
```

---

# Core Database Tables

Authentication

- users
- roles
- permissions

Shipment

- shipments
- shipment_items
- shipment_status_history

Drivers

- drivers
- vehicles
- driver_locations

Dispatch

- assignments
- routes

Warehouse

- warehouses
- warehouse_inventory

Payment

- payments
- payment_transactions

Delivery

- delivery_proofs

System

- notifications
- audit_logs

---

# API Modules

## Authentication

- POST api/v1/auth/register
- POST api/v1/auth/login
- POST api/v1/auth/logout
- POST api/v1/auth/refresh
- POST api/v1/auth/forgot-password

---

## Users

- GET /users
- GET /users/:id
- PATCH /users/:id

---

## Shipments

- POST /shipments
- GET /shipments
- GET /shipments/:id
- PATCH /shipments/:id
- DELETE /shipments/:id

---

## Drivers

- GET /drivers
- PATCH /drivers/:id
- GET /drivers/:id/history

---

## Dispatcher

- POST /assignments
- PATCH /assignments/:id

---

## Tracking

- GET /tracking/:trackingNumber

---

## Payments

- POST /payments
- POST /payments/webhook

---

# Project Roadmap

## Phase 1 (Foundation)

- [ ] Project setup
- [ ] Authentication
- [ ] Database design
- [ ] User roles
- [ ] Swagger
- [ ] Docker

---

## Phase 2 (Core Logistics)

- [ ] Shipment CRUD
- [ ] Pricing Engine
- [ ] Driver Assignment
- [ ] Tracking Numbers
- [ ] Shipment History

---

## Phase 3 (Payments)

- [ ] Paystack
- [ ] Webhooks
- [ ] Payment Verification

---

## Phase 4 (Real-Time)

- [ ] Socket.io
- [ ] Driver Location
- [ ] Live Tracking

---

## Phase 5 (Notifications)

- [ ] Email
- [ ] SMS
- [ ] Push Notifications

---

## Phase 6 (Advanced)

- [ ] Redis
- [ ] BullMQ
- [ ] Scheduled Jobs
- [ ] Analytics Dashboard

---

## Phase 7 (Production)

- [ ] CI/CD
- [ ] Docker Deployment
- [ ] Nginx
- [ ] Monitoring
- [ ] Logging

---

# Future Improvements

- Route Optimization
- QR Code Delivery
- OTP Verification
- Driver Mobile App
- Customer Mobile App
- AI Route Prediction
- Multi-Tenant Companies
- Warehouse Automation
- Barcode Scanning

---

# Testing

- Unit Tests
- Integration Tests
- API Tests
- End-to-End Tests

---

# Deployment

Development

- Docker Compose

Production

- Docker
- Nginx
- PostgreSQL
- Redis
- PM2

---

# License

MIT