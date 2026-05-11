package com.mrnothing.mobile.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.launch
import com.mrnothing.mobile.network.DeviceRegistrationService

@Composable
fun AgentHomeScreen() {
    var status by remember { mutableStateOf("Idle") }
    val scope = rememberCoroutineScope()

    Column {
        Text("MR NOTHING Agent Console")
        Text(status)
        Button(onClick = {
            scope.launch {
                try {
                    val result = DeviceRegistrationService.registerDevice()
                    status = result.status
                } catch (e: Exception) {
                    status = "Error"
                }
            }
        }) {
            Text("Register Device")
        }
    }
}
