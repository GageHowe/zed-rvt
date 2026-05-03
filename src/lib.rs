use std::{env::current_dir, fs, path::PathBuf};

use zed_extension_api as zed;

struct ReachVariantToolExtension;

impl ReachVariantToolExtension {
    fn ensure_server_script(&self) -> Result<PathBuf, String> {
        let root = current_dir().map_err(|err| format!("failed to read current dir: {err}"))?;
        let server_dir = root.join("rvt-language-server");
        fs::create_dir_all(&server_dir)
            .map_err(|err| format!("failed to create language server dir: {err}"))?;
        let server_path = server_dir.join("server.js");
        fs::write(&server_path, include_str!("server.js"))
            .map_err(|err| format!("failed to write language server: {err}"))?;
        Ok(server_path)
    }
}

impl zed::Extension for ReachVariantToolExtension {
    fn new() -> Self {
        Self
    }

    fn language_server_command(
        &mut self,
        _language_server_id: &zed::LanguageServerId,
        worktree: &zed::Worktree,
    ) -> zed::Result<zed::Command> {
        let node = zed::node_binary_path()
            .or_else(|_| {
                worktree
                    .which("node")
                    .ok_or_else(|| "failed to find a Node.js binary for the RVT language server".to_string())
            })?;
        let server_path = self.ensure_server_script()?;

        Ok(zed::Command::new(node).arg(
            server_path
                .to_str()
                .ok_or("failed to convert language server path to string")?,
        ))
    }
}

zed::register_extension!(ReachVariantToolExtension);
