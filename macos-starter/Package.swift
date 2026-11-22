// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "HLSPlayerStarter",
    platforms: [.macOS(.v14)],
    targets: [
        .executableTarget(
            name: "HLSPlayerStarter",
            resources: [.copy("sample.m3u")],
            linkerSettings: [.linkedFramework("AVKit")]
        )
    ]
)
