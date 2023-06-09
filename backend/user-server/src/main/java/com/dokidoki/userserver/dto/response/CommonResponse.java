package com.dokidoki.userserver.dto.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor(staticName = "of")
public class CommonResponse<D> {
    private final Integer status_code;
    private final String message;
    private final D data;
}
