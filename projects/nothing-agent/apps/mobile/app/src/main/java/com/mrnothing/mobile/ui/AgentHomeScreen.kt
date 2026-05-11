package com.mrnothing.mobile.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import com.mrnothing.mobile.network.DeviceRegistrationService

@Composable
fun AgentHomeScreen() {
    var status by remember { mutableStateOf("Idle") }

    Column {
        Text("MR NOTHING Agent Console")
        Text(status)
        Button(onClick = {
            CoroutineScope(Dispatchers.IO).launch {
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
