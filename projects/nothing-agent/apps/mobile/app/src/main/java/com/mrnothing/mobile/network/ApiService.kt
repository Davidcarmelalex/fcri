package com.mrnothing.mobile.network

import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("/devices/register")
    suspend fun registerDevice(@Body payload: Map<String, String>): DeviceRegistrationResponse
}
