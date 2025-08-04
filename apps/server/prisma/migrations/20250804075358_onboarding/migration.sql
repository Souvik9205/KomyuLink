-- CreateEnum
CREATE TYPE "public"."OTP_Type" AS ENUM ('UserOtp', 'EverntOtp', 'RegisterOtp');

-- CreateEnum
CREATE TYPE "public"."EVENT_PAY_TYPE" AS ENUM ('Free', 'Paid', 'Custom');

-- CreateEnum
CREATE TYPE "public"."EVENT_STATUS" AS ENUM ('Upcoming', 'Ongoing', 'Completed');

-- CreateEnum
CREATE TYPE "public"."PARTICIPANTS_TYPE" AS ENUM ('collegeOnly', 'openToAll', 'reviewBased', 'fresherOnly', 'juniorOnly', 'seniorOnly');

-- CreateEnum
CREATE TYPE "public"."VENUE_TYPE" AS ENUM ('Online', 'Offline', 'Hybrid');

-- CreateEnum
CREATE TYPE "public"."EVENT_TYPE" AS ENUM ('Workshop', 'Seminar', 'Hackathon', 'Competition', 'Other');

-- CreateEnum
CREATE TYPE "public"."RESOURCE_TYPE" AS ENUM ('Document', 'Video', 'Audio', 'Image');

-- CreateEnum
CREATE TYPE "public"."AuthProvider" AS ENUM ('GOOGLE', 'GITHUB', 'EMAIL_OTP');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "imgURL" TEXT,
    "authProvider" "public"."AuthProvider" NOT NULL DEFAULT 'EMAIL_OTP',
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Onboarding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "college" TEXT,
    "year" INTEGER,
    "department" TEXT,
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Onboarding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "paymentType" "public"."EVENT_PAY_TYPE" NOT NULL DEFAULT 'Free',
    "topics" TEXT[],
    "eventDate" TIMESTAMP(3) NOT NULL,
    "eventStatus" "public"."EVENT_STATUS" NOT NULL DEFAULT 'Upcoming',
    "eventType" "public"."EVENT_TYPE" NOT NULL DEFAULT 'Workshop',
    "participantsType" "public"."PARTICIPANTS_TYPE" NOT NULL DEFAULT 'collegeOnly',
    "participantsLimit" INTEGER,
    "venueType" "public"."VENUE_TYPE" NOT NULL DEFAULT 'Online',
    "venue" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApplicationForm" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL DEFAULT 'text',

    CONSTRAINT "ApplicationForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventResource" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "type" "public"."RESOURCE_TYPE" NOT NULL DEFAULT 'Document',
    "readCount" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "comments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attendance" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fields" JSONB NOT NULL,
    "verified" BOOLEAN NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "participants" INTEGER NOT NULL,
    "Review" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Otp" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "type" "public"."OTP_Type" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_EventOwnership" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventOwnership_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Onboarding_userId_key" ON "public"."Onboarding"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_eventId_key" ON "public"."Review"("eventId");

-- CreateIndex
CREATE INDEX "_EventOwnership_B_index" ON "public"."_EventOwnership"("B");

-- AddForeignKey
ALTER TABLE "public"."Onboarding" ADD CONSTRAINT "Onboarding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicationForm" ADD CONSTRAINT "ApplicationForm_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventResource" ADD CONSTRAINT "EventResource_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EventOwnership" ADD CONSTRAINT "_EventOwnership_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EventOwnership" ADD CONSTRAINT "_EventOwnership_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
