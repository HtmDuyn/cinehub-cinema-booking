package com.cinehub.backend.dto.request;

public class BookingRequest {
    private int totalTicketQty;
    private String note;

    // --- Getter & Setter thủ công ---
    public int getTotalTicketQty() {
        return totalTicketQty;
    }

    public void setTotalTicketQty(int totalTicketQty) {
        this.totalTicketQty = totalTicketQty;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
