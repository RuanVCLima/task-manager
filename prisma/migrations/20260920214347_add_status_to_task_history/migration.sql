/*
  Warnings:

  - Added the required column `changed_at` to the `task_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `new_status` to the `task_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task_history" ADD COLUMN     "changed_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "new_status" "TasksStatus" NOT NULL,
ADD COLUMN     "old_status" "TasksStatus" NOT NULL DEFAULT 'pending';
