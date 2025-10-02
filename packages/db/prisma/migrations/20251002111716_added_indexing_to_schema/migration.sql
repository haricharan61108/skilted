-- CreateIndex
CREATE INDEX "Bid_jobId_idx" ON "Bid"("jobId");

-- CreateIndex
CREATE INDEX "Bid_userId_idx" ON "Bid"("userId");

-- CreateIndex
CREATE INDEX "Chat_adminId_idx" ON "Chat"("adminId");

-- CreateIndex
CREATE INDEX "Chat_userId_idx" ON "Chat"("userId");

-- CreateIndex
CREATE INDEX "Job_adminId_idx" ON "Job"("adminId");

-- CreateIndex
CREATE INDEX "Message_chatId_idx" ON "Message"("chatId");
