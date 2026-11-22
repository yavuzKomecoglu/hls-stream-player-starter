import AVKit
import SwiftUI

struct Channel: Identifiable, Hashable {
    let id = UUID()
    let name: String
    let group: String
    let url: URL
}

func parseM3U(_ text: String) -> [Channel] {
    var channels: [Channel] = []
    var name: String?
    var group = ""

    for raw in text.split(whereSeparator: \.isNewline) {
        let line = raw.trimmingCharacters(in: .whitespaces)
        if line.hasPrefix("#EXTINF:") {
            name = line.split(separator: ",", maxSplits: 1).last
                .map { $0.trimmingCharacters(in: .whitespaces) }
            group = line.firstMatch(of: #/group-title="([^"]*)"/#)
                .map { String($0.1) } ?? ""
        } else if !line.isEmpty, !line.hasPrefix("#"),
                  let current = name, let url = URL(string: line) {
            channels.append(Channel(name: current, group: group, url: url))
            name = nil
        }
    }
    return channels
}

struct ContentView: View {
    @State private var channels: [Channel] = []
    @State private var selection: Channel?
    @State private var player = AVPlayer()

    var body: some View {
        NavigationSplitView {
            List(channels, selection: $selection) { channel in
                VStack(alignment: .leading) {
                    Text(channel.name)
                    Text(channel.group)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                .tag(channel)
            }
        } detail: {
            VideoPlayer(player: player)
        }
        .onChange(of: selection) { _, channel in
            guard let channel else { return }
            player.replaceCurrentItem(with: AVPlayerItem(url: channel.url))
            player.play()
        }
        .task {
            let url = Bundle.module.url(forResource: "sample", withExtension: "m3u")!
            channels = parseM3U((try? String(contentsOf: url, encoding: .utf8)) ?? "")
        }
    }
}

@main
struct HLSPlayerStarterApp: App {
    init() {
        // `swift run` ile açıldığında pencerenin öne gelmesi için
        NSApplication.shared.setActivationPolicy(.regular)
    }

    var body: some Scene {
        WindowGroup("HLS Player") { ContentView() }
    }
}
