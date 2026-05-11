package com.mrnothing.mobile.network

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object DeviceRegistrationService {
    private val api = Retrofit.Builder()
        .baseUrl(ApiClient.BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(ApiService::class.java)

    suspend fun registerDevice(): DeviceRegistrationResponse {
        return api.registerDevice(
            mapOf(
                "device_id" to "android-demo-001",
                "platform" to "android"
            )
        )
    }
}
