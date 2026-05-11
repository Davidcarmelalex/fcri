package com.mrnothing.mobile.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import com.mrnothing.mobile.network.DeviceRegistrationService

@Composable
fun AgentHomeScreen() {
    Column {
        Text("MR NOTHING Agent Console")
        Button(onClick = {
            DeviceRegistrationService.registerPayload()
        }) {
            Text("Register Device")
        }
    }
}
