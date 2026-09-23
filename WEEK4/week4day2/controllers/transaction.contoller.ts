import { Request, Response } from "express";
import { TransferService } from "../services/transaction.service.js";

const transferService = new TransferService();

export const handleTransfer = async (req: Request, res: Response) => {
  try {
    const { fromAccountId, toAccountId, amountInCents } = req.body;

    //Validation step
    //Can this be further improved ??

    // 1. Check if required fields exist
    if (
      !fromAccountId ||
      !toAccountId ||
      amountInCents === undefined ||
      amountInCents === ""
    ) {
      res.status(400).json({
        success: false,
        message:
          "Missing required fields: fromAccountId, toAccountId, or amountInCents",
      });
    }

    let parsedAmount: bigint;

    // 2. Parse to BigInt inside a try/catch to catch non-numeric strings (e.g., "abc")
    try {
      parsedAmount = BigInt(amountInCents);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount: amountInCents must be a valid integer",
      });
    }

    // 3. Ensure the amount is strictly positive (> 0)
    if (parsedAmount <= 0n) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount: amountInCents must be greater than 0",
      });
    }

    const result = await transferService.executeTranfser(
      fromAccountId,
      toAccountId,
      parsedAmount,
    );

    return res.status(200).json({
      success: true,
      message: "Transfer completed successfully",
      data: {
        transactionId: result.transactionId,
        fromAccountId: result.fromAccountId,
        toAccountId: result.toAccountId,
        amountInCents: result.amountInCents.toString(), // Convert BigInt to string for JSON
        newBalanceInCents: result.newSenderBalance.toString(),
        timestamp: result.timestamp,
      },
    });
  } catch (error: any) {
    return res.status(422).json({
      success: false,
      message: error.message || "Failed to perform tranfer",
    });
  }
};
