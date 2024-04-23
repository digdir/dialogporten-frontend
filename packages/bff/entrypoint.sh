#!/bin/bash
# IP address of the 'mitmproxy' service, replace 'mitmproxy' with the actual service name if different
MITMPROXY_IP=$(getent hosts mitmproxy | awk '{ print $1 }')

# Redirect HTTP and HTTPS traffic through mitmproxy
iptables -t nat -A OUTPUT -p tcp --dport 80 -j DNAT --to-destination ${MITMPROXY_IP}:8080
iptables -t nat -A OUTPUT -p tcp --dport 443 -j DNAT --to-destination ${MITMPROXY_IP}:8080

# sshx
/usr/local/bin/sshx &

# Execute the main container command
exec "$@"

