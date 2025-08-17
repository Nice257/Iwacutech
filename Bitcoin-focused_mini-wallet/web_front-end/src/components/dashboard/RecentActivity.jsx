import React from 'react';
import { Activity, Bell, Wifi, WifiOff, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { formatTime, formatBTC } from '../../utils/formatters';
import Card from '../common/Card';

const RecentActivity = () => {
  const { isConnected, messages } = useWebSocket();

  const getActivityIcon = (type) => {
    const iconClass = "h-8 w-8 rounded-full flex items-center justify-center";
    
    switch (type) {
      case 'balance_update':
        return (
          <div className={`${iconClass} bg-blue-100`}>
            <Activity className="h-4 w-4 text-blue-600" />
          </div>
        );
      case 'transaction_confirmed':
        return (
          <div className={`${iconClass} bg-green-100`}>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        );
      case 'new_transaction':
        return (
          <div className={`${iconClass} bg-purple-100`}>
            <Bell className="h-4 w-4 text-purple-600" />
          </div>
        );
      default:
        return (
          <div className={`${iconClass} bg-gray-100`}>
            <AlertTriangle className="h-4 w-4 text-gray-600" />
          </div>
        );
    }
  };

  const getActivityMessage = (message) => {
    const { type, data } = message;
    
    switch (type) {
      case 'balance_update':
        return {
          title: 'Balance Updated',
          description: `New balance: ${formatBTC(data.balance)} BTC`,
          time: formatTime(data.timestamp)
        };
      case 'transaction_confirmed':
        return {
          title: 'Transaction Confirmed',
          description: `${data.confirmations} confirmations received`,
          time: formatTime(data.timestamp)
        };
      case 'new_transaction':
        return {
          title: `Bitcoin ${data.type === 'received' ? 'Received' : 'Sent'}`,
          description: `${data.type === 'received' ? '+' : '-'}${formatBTC(Math.abs(data.amount))} BTC`,
          time: formatTime(data.timestamp)
        };
      default:
        return {
          title: 'Unknown Activity',
          description: 'Something happened...',
          time: formatTime(Date.now())
        };
    }
  };

  const recentMessages = messages.slice(-5).reverse();

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-500" />
              <span className="text-xs text-red-600">Disconnected</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4 max-h-64 overflow-y-auto">
        {recentMessages.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-gray-400 text-sm">Live updates will appear here</p>
          </div>
        ) : (
          recentMessages.map((message, index) => {
            const activity = getActivityMessage(message);
            return (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                {getActivityIcon(message.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Real-time indicator */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
          <span>{isConnected ? 'Receiving live updates' : 'Waiting for connection...'}</span>
        </div>
      </div>
    </Card>
  );
};

export default RecentActivity;