from pathlib import Path
from azrael_core.demo_scenario import run_synthetic_demo


def test_end_to_end_synthetic_demo(tmp_path):
    report = run_synthetic_demo(tmp_path / "sandbox.sqlite")
    assert report["mode"] == "SYNTHETIC_OFFLINE_DEMO"
    assert report["priority"] == "P0"
    assert report["anonymous_intake"]
    assert report["unauthenticated_resume_blocked"]
    assert report["conversation_turns"] == 4
    assert report["languages"] == ["en", "ml"]
    assert report["officer_handover_events"] >= 3
    assert report["notification_delivery"] == "MOCK_ACKNOWLEDGEMENT_DELIVERED"
    assert not report["real_provider_used"]
    assert not report["official_fir_registered"]
