"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
    Table,
    Tag,
    Space,
    Button,
    message,
    Spin,
    Pagination,
    Card,
    Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import apiClient from "@/api/apiClient";
import { API_ENDPOINTS } from "@/constants/api";

interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

interface OrderResponse {
    id: number;
    userName: string;
    userEmail: string;
    phone: string;
    shippingAddress: Address;
    paymentMethod: string;
    status: string;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    itemCount: number;
    createdAt: string;
    updatedAt: string;
}

interface PagedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
}

export default function OrderPage() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);

    /** 🌀 Fetch orders */
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient.get<PagedResponse<OrderResponse>>(
                API_ENDPOINTS.ORDERS.BASE,
                { params: { page, size } }
            );
            const data = res.data;
            setOrders(data.content ?? []);
            setTotal(data.totalElements ?? 0);
        } catch (err: unknown) {
            if (err instanceof Error) message.error(err.message);
            else message.error("Không thể tải danh sách đơn hàng");
        } finally {
            setLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    /** 🎨 Màu trạng thái (nông nghiệp) */
    const getStatusColor = (status: string): string => {
        switch (status.toUpperCase()) {
            case "DELIVERED":
                return "green";
            case "PROCESSING":
                return "blue";
            case "SHIPPED":
                return "cyan";
            case "CANCELLED":
                return "red";
            case "PENDING":
            default:
                return "orange";
        }
    };

    /** 🔁 Cập nhật trạng thái đơn hàng */
    const updateOrderStatus = async (id: number, status: string) => {
        try {
            setLoading(true);
            await apiClient.put(`${API_ENDPOINTS.ORDERS.BASE}/${id}/status`, { status });
            message.success(`✅ Đã cập nhật đơn hàng #${id} sang trạng thái ${status}`);
            fetchOrders();
        } catch (err: unknown) {
            if (err instanceof Error) message.error(err.message);
            else message.error("Cập nhật trạng thái thất bại");
        } finally {
            setLoading(false);
        }
    };

    /** 📦 Cột bảng */
    const columns: ColumnsType<OrderResponse> = [
        {
            title: "Mã đơn",
            dataIndex: "id",
            key: "id",
            render: (id: number) => <b style={{ color: "#2E7D32" }}>#{id}</b>,
        },
        {
            title: "Khách hàng",
            key: "userName",
            render: (_, record) => (
                <>
                    <div style={{ fontWeight: 600 }}>{record.userName}</div>
                    <div style={{ color: "#666", fontSize: 12 }}>{record.userEmail}</div>
                </>
            ),
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
            render: (v: string) => v || "—",
        },
        {
            title: "Địa chỉ giao hàng",
            key: "shippingAddress",
            render: (_, r) =>
                r.shippingAddress
                    ? `${r.shippingAddress.street}, ${r.shippingAddress.city}, ${r.shippingAddress.country}`
                    : "—",
        },
        {
            title: "Thanh toán",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            render: (pm: string) => <Tag color="blue">{pm}</Tag>,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (st: string) => (
                <Tag
                    color={getStatusColor(st)}
                    style={{
                        fontWeight: 500,
                        borderRadius: 6,
                        padding: "2px 10px",
                        textTransform: "capitalize",
                    }}
                >
                    {st === "DELIVERED"
                        ? "Hoàn thành"
                        : st === "PENDING"
                            ? "Chờ xử lý"
                            : st === "PROCESSING"
                                ? "Đang xử lý"
                                : st === "SHIPPED"
                                    ? "Đang giao"
                                    : st === "CANCELLED"
                                        ? "Đã hủy"
                                        : st}
                </Tag>
            ),
        },
        {
            title: "Tổng tiền",
            dataIndex: "total",
            key: "total",
            render: (v: number) => (
                <span style={{ color: "#2E7D32", fontWeight: 600 }}>
                    {Number(v).toLocaleString("vi-VN")} ₫
                </span>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (v: string) => (
                <span style={{ color: "#666" }}>
                    {dayjs(v).format("DD/MM/YYYY HH:mm")}
                </span>
            ),
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_, r) => {
                switch (r.status.toUpperCase()) {
                    case "PENDING":
                        return (
                            <Space>
                                <Button
                                    size="small"
                                    type="primary"
                                    style={{ background: "#4CAF50", border: "none" }}
                                    onClick={() => updateOrderStatus(r.id, "PROCESSING")}
                                >
                                    Xử lý
                                </Button>
                                <Popconfirm
                                    title="Hủy đơn hàng này?"
                                    okText="Có"
                                    cancelText="Không"
                                    onConfirm={() => updateOrderStatus(r.id, "CANCELLED")}
                                >
                                    <Button size="small" danger>
                                        Hủy
                                    </Button>
                                </Popconfirm>
                            </Space>
                        );

                    case "PROCESSING":
                        return (
                            <Button
                                size="small"
                                type="primary"
                                style={{ background: "#2E7D32", border: "none" }}
                                onClick={() => updateOrderStatus(r.id, "SHIPPED")}
                            >
                                Giao hàng
                            </Button>
                        );

                    case "SHIPPED":
                        return (
                            <Button
                                size="small"
                                type="primary"
                                style={{ background: "#43A047", border: "none" }}
                                onClick={() => updateOrderStatus(r.id, "DELIVERED")}
                            >
                                Hoàn thành
                            </Button>
                        );

                    default:
                        return null;
                }
            },
        },
    ];

    return (
        <Card
            style={{
                margin: 20,
                background: "#ffffff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                fontFamily: "Roboto, Open Sans, sans-serif",
            }}
            title={
                <h2 style={{ margin: 0, color: "#2E7D32", fontWeight: 600 }}>
                    🌱 Quản lý đơn hàng
                </h2>
            }
        >
            {loading ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <Table
                        columns={columns}
                        dataSource={orders}
                        rowKey="id"
                        pagination={false}
                        bordered
                    />
                    <div style={{ textAlign: "right", marginTop: 16 }}>
                        <Pagination
                            current={page + 1}
                            pageSize={size}
                            total={total}
                            onChange={(p, ps) => {
                                setPage(p - 1);
                                setSize(ps);
                            }}
                            showSizeChanger
                        />
                    </div>
                </>
            )}
        </Card>
    );
}
