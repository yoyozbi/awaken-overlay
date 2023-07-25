-- CreateTable
CREATE TABLE "LoginAttemps" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "sucessful" BOOLEAN NOT NULL,
    "triedPassword" TEXT,
    "when" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttemps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoginAttemps" ADD CONSTRAINT "LoginAttemps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
