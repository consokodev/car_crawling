# -*- coding: utf-8 -*-

from collections import namedtuple

ErrorCodeProperties = namedtuple("ErrorCodeProperties", ["code", "message"])

SUCCESS = ErrorCodeProperties(0, "Thành Công")
FAIL = ErrorCodeProperties(-1, "Thất Bại")

MODULE_NOT_ALLOW = ErrorCodeProperties(-8, "Module không được phép sử dụng")

PERMISSION_DENY = ErrorCodeProperties(-9, "Không Có Quyền")


ERROR  = ErrorCodeProperties(-10, "Lỗi")
SERVER_ERROR = ErrorCodeProperties(-11, "Server Lỗi")

EXCEPTION  = ErrorCodeProperties(-100, "Excection")

INVALID_DATA = ErrorCodeProperties(-110, "Invalid Data")
INVALID_PARAM = ErrorCodeProperties(-111, "Invalid Param")
INVALID_SIGNATURE = ErrorCodeProperties(-112, "Invalid  Signature")
INVALID_METHOD  = ErrorCodeProperties(-200, "Invalid Method")

NOT_FOUND = ErrorCodeProperties(-404, "Không Tìm Thấy")
BAD_REQUEST = ErrorCodeProperties(-400, "Request Ngu")