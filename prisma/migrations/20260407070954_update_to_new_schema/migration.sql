/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropTable
DROP TABLE [dbo].[User];

-- CreateTable
CREATE TABLE [dbo].[AuthCredential] (
    [userId] UNIQUEIDENTIFIER NOT NULL,
    [loginName] NVARCHAR(50) NOT NULL,
    [passwordHash] NVARCHAR(255) NOT NULL,
    [salt] NVARCHAR(50) NOT NULL,
    [lastLoginIp] NVARCHAR(45),
    [lastLoginTime] DATETIME,
    [loginFailCount] INT NOT NULL CONSTRAINT [AuthCredential_loginFailCount_df] DEFAULT 0,
    [isLocked] BIT NOT NULL CONSTRAINT [AuthCredential_isLocked_df] DEFAULT 0,
    [createdAt] DATETIME NOT NULL CONSTRAINT [AuthCredential_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [AuthCredential_pkey] PRIMARY KEY CLUSTERED ([userId]),
    CONSTRAINT [AuthCredential_loginName_key] UNIQUE NONCLUSTERED ([loginName])
);

-- CreateTable
CREATE TABLE [dbo].[UserProfile] (
    [userId] UNIQUEIDENTIFIER NOT NULL,
    [fullName] NVARCHAR(100),
    [email] NVARCHAR(100),
    [phone] NVARCHAR(20),
    [avatarUrl] NVARCHAR(500),
    [status] INT NOT NULL CONSTRAINT [UserProfile_status_df] DEFAULT 1,
    CONSTRAINT [UserProfile_pkey] PRIMARY KEY CLUSTERED ([userId])
);

-- AddForeignKey
ALTER TABLE [dbo].[UserProfile] ADD CONSTRAINT [UserProfile_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[AuthCredential]([userId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
